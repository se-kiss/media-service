import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchArgs, SearchBody } from './search.dto';
import { SearchResult } from './search.interface';

@Injectable()
export class SearchService {
  index = 'playlist';

  constructor(private readonly esService: ElasticsearchService) {}

  async indexMedia(playlist: SearchBody): Promise<number> {
    const res = await this.esService.index<SearchResult, SearchBody>({
      id: playlist.playlistId,
      index: this.index,
      body: {
        playlistId: playlist.playlistId,
        name: playlist.name,
        ownerName: playlist.ownerName,
        description: playlist.description,
        tags: playlist.tags,
        types: playlist.types,
      },
    });
    return res.statusCode;
  }

  async search(args: SearchArgs): Promise<SearchBody[]> {
    const searchBody = {
      from: args.from,
      size: args.size,
      query: {
        bool: {
          must: [
            {
              query_string: {
                query: args.text,
                fields: ['name', 'ownerName', 'tags', 'description', 'types'],
                analyze_wildcard: true,
              },
            },
            {
              terms: {
                tags: args.tags,
              },
            },
            {
              terms: {
                types: args.types,
              },
            },
          ],
        },
      },
    };
    const { body } = await this.esService.search<SearchResult>({
      index: this.index,
      body: searchBody,
    });
    const hits = body.hits.hits;
    return hits.map(item => item._source);
  }

  async update(args: SearchBody): Promise<number> {
    const newMedia: Omit<SearchBody, 'playlistId' | 'tags' | 'types'> = {
      name: args.name,
      description: args.description || '',
      ownerName: args.ownerName,
    };
    const bodyScript = Object.entries(newMedia).reduce(
      (result, [key, value]) => {
        return `${result} ctx._source.${key} = '${value}';`;
      },
      '',
    );
    const tagsScript = 'ctx._source.tags = params.tags;';
    const typesScript = 'ctx._source.types = params.types;';
    const res = await this.esService.update({
      index: this.index,
      id: args.playlistId,
      body: {
        script: {
          source: bodyScript + tagsScript + typesScript,
          params: {
            tags: args.tags,
            types: args.types,
          },
        },
      },
    });
    return res.statusCode;
  }

  async remove(playlistId: string): Promise<number> {
    const res = await this.esService.delete({
      index: this.index,
      id: playlistId,
    });
    return res.statusCode;
  }

  async clearIndex(): Promise<number> {
    const res = await this.esService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match_all: {},
        },
      },
    });
    return res.statusCode;
  }
}
