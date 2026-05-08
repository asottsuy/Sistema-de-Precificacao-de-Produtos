import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { VALID_UNITS } from '@core/domain/constants/measurament-units';
//criando uma pipe personalizada para transformar/ validar as unidades de medida.w

@Injectable()
export class UnitValidationPipe implements PipeTransform {
  transform(value: any) {
    // Se estivermos validando o objeto inteiro (Body)
    const unit = value.unit?.toLowerCase();

    if (!unit || !VALID_UNITS.includes(unit as any)) {
      throw new BadRequestException(
        `Unidade de medida inválida. As unidades aceitas são: ${VALID_UNITS.join(', ')}`,
      );
    }

    // Retornamos o valor com a unidade normalizada para minúsculo
    return { ...value, unit };
  }
}
