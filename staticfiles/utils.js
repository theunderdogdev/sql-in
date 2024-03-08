const serializeObject = function (array) {
  return array.reduce((_obj, elem) => {
    _obj[elem.name] = elem.value;
    return _obj;
  }, {});
};
$.ajaxSetup({
  xhrFields: {
    withCredentials: true,
  },
});
