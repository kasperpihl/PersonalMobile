import { setOption, addPlugin } from 'react-swiss';

setOption('inline', true);

addPlugin('parseKeyValue', (key, value) => {
  const intRegex = /^([+-]?[1-9]\d*|0)$/;
  const floatRegex = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
  if(intRegex.test(value)) {
    value = parseInt(value, 10);
  } else if(floatRegex.test(value)) {
    value = parseFloat(value);
  }
  return { key, value };
});