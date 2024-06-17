import _ from 'lodash';

export const MushForm = (form = []) => {
  let isError;
  let errorMessages = {};

  for (let conf of form) {
    switch (conf.type) {
      case 'input':
        if (conf.isRequired && _.isEmpty(conf.value)) {
          isError = true;
          errorMessages[conf.id] = `${conf.label} tidak boleh kosong.`;
        }

        if (conf.isRequired && !_.isEmpty(conf.value) && conf.minLength) {
          if (conf.value.length < conf.minLength) {
            isError = true;
            errorMessages[
              conf.id
            ] = `${conf.label} tidak boleh kurang dari ${conf.minLength} karakter.`;
          }
        }
        break;
      case 'dropdown':
        if (conf.isRequired && _.isEmpty(conf.value)) {
          isError = true;
          errorMessages[conf.id] = `${conf.label} harus dipilih.`;
        }
        break;
      case 'number':
        if (conf.isRequired && _.isEmpty(conf.value)) {
          isError = true;
          errorMessages[conf.id] = `${conf.label} tidak boleh kosong`;
        }

        if (
          conf.isRequired &&
          !_.isEmpty(conf.value) &&
          String(conf.value) == '0'
        ) {
          isError = true;
          errorMessages[conf.id] = `${conf.label} tidak boleh 0`;
        }
        break;
      default:
        isError = false;
        errorMessages = {};
        break;
    }
  }

  return {error: isError, errorMessages: errorMessages};
};
