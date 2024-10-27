import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
  @ApiProperty({
    description: '내림차 또는 오름차 정렬',
    example: ['id_DESC'],
  })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  // id_ASC id_DESC
  // ["likeCount_DESC", "id_DESC"]
  order: string[] = ['id_DESC'];

  @IsInt()
  @IsOptional()
  take?: number = 5;
}
