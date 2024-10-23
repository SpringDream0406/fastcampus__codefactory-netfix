import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CursorPaginationDto {
  @IsString()
  @IsOptional()
  // id_52,LikeCount_20
  cursor?: string;

  @IsArray()
  @IsString({
    each: true,
  })
  @IsOptional()
  // id_ASC id_DESC
  // ["likeCount_DESC", "id_DESC"]
  order: string[] = ['id_DESC'];

  @IsInt()
  @IsOptional()
  take?: number = 5;
}