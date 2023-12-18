import lodashTemplate from 'lodash.template';

/**
 * add data to the clipboard
 *
 * @param data the data to be copied
 * @param values if provided, the param `data` will be treated as a template
 */
export function copy(
  data: string,
  values?: { [key: string]: any },
): Promise<string> {
  if (values) {
    try {
      let templateFn = lodashTemplate(data);
      data = templateFn(values);
    } catch (error: any) {
      error.message = 'invalid template, ' + error.message;
      return Promise.reject(error);
    }
  }

  return navigator.clipboard
    ? navigator.clipboard.writeText(data).then(() => data)
    : new Promise<string>((resolve, reject) => {
        // https://dev.to/tqbit/how-to-use-javascript-to-copy-text-to-the-clipboard-2hi2
        try {
          let area = document.createElement('textarea');
          area.value = data;
          document.body.append(area);
          area.select();
          if (document.execCommand('copy')) {
            resolve(data);
          }
          area.remove();
        } catch (error: any) {
          reject(error);
        }
      });
}
