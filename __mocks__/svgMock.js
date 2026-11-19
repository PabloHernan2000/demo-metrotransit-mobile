const React = require('react');
const { View } = require('react-native');

const SvgMock = (props) => React.createElement(View, props, props.children);
SvgMock.displayName = 'SvgMock';

module.exports = SvgMock;
module.exports.default = SvgMock;
module.exports.__esModule = true;
module.exports.ReactComponent = SvgMock;
