import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class MovieTitleValidationPipe implements PipeTransform<string, string> {
  // 제너릭 = <string(in), string(out)> 타입설정
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!value) return value;
    // 만약에 글자 길이가 2보다 적으면 에러 던지기!
    if (value.length <= 2)
      throw new BadRequestException('영화의 제목은 3자 이상 작성해주세요!');
    return value;
  }
}
