export function openSearchXml() {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">',
    "<ShortName>bobob.app</ShortName>",
    "<Description>Search bobob.app web-operations tools, Blog, and Play.</Description>",
    "<InputEncoding>UTF-8</InputEncoding>",
    '<Image height="16" width="16" type="image/x-icon">https://www.bobob.app/favicon.ico</Image>',
    '<Url type="text/html" method="get" template="https://www.bobob.app/search?q={searchTerms}" />',
    "</OpenSearchDescription>",
  ].join("");
}
