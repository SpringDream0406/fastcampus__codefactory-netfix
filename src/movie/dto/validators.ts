import {
  Contains,
  Equals,
  IsAlphanumeric,
  IsArray,
  IsBoolean,
  IsCreditCard,
  IsDate,
  IsDateString,
  IsDefined,
  IsDivisibleBy,
  IsEmpty,
  IsEnum,
  IsHexColor,
  IsIn,
  IsInt,
  IsLatLong,
  IsNegative,
  IsNotEmpty,
  IsNotIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  NotContains,
  NotEquals,
  registerDecorator,
  Validate,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({
  async: true,
})
class PasswordValidator implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    return value.length > 4 && value.length < 8;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return '비밀번호의 길이는 4~8자 여야합니다. 입력된 비밀번호: ($value)';
  }
}

function IsPasswordValid(validationoptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationoptions,
      validator: PasswordValidator,
    });
  };
}

export class CreateMovieDto {
  title: string;

  // null || undefined 안됨
  @IsDefined()

  // ? type으로 만들어주는거
  @IsOptional()

  // 해당 값만 가능
  @Equals('code factory')

  // 해당 값은 안됨
  @NotEquals('code factory')

  // null || undefined || '' , isDefined와 반대인데 ''가 추가됨
  @IsEmpty()

  // IsEmpty의 반대
  @IsNotEmpty()

  // Array
  // 리스트 중 한 개 여야한다.
  @IsIn(['action', 'fantasy'])

  // 리스트 중 한 개면 안된다.
  @IsNotIn(['action', 'fantasy'])

  //
  // Type
  @IsBoolean()
  @IsString()
  @IsNumber()
  @IsInt() // 정수
  @IsArray()
  //   @IsEnum(이넘명)
  @IsDate()
  @IsDateString() // '2024-07-07T12:00:00.000Z' 까지 필요한만큼 짤라서 가능 (Z는 UTC 타임 의미, 없으면 현지시간)

  // 숫자
  // 숫자로 나눌 수 있나
  @IsDivisibleBy(5)

  // 양수인가
  @IsPositive()

  // 음수인가
  @IsNegative()

  // 최솟값
  @Min(50)

  // 최대값
  @Max(100)

  // 문자
  // 해당 문자를 포함하고 있나
  @Contains('code factory')

  // 해당 문자를 포함 안 하고 있나
  @NotContains('code factory')

  // 알파벳과 숫자로 이루어져 있나 (빈칸도 안됨)
  @IsAlphanumeric()

  // 존재할 수 있는 카드의 번호 인가 (4-4-4-4 인데 처음 4가 가능성이 있나)
  @IsCreditCard()

  // 16진수로 된 색상 코드 인가
  @IsHexColor()

  // 최대 길이
  @MaxLength(16)

  // 최소 길이
  @MinLength(4)

  // UUID 인가
  @IsUUID()

  // 위도 경도
  @IsLatLong()
  @Validate(PasswordValidator)

  // function으로 만들기
  @IsPasswordValid()
  test: string;
}
