const mammoth = require('mammoth');
export const DocToHtml = (path: string) => {
  return new Promise((resolve, reject) => {
    mammoth
      .convertToHtml({ path })
      .then(function (result: { value: any; messages: any }) {
        console.log(result.messages);
        resolve(result.value);
      })
      .done();
  });
};
