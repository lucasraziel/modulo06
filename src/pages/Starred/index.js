import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { WebView } from 'react-native-webview';

export default class Starred extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('starred').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    repositoryUrl: '#',
  };

  componentDidMount() {
    const { navigation } = this.props;
    this.setState({ repositoryUrl: navigation.getParam('starred').html_url });
  }

  render() {
    const { repositoryUrl } = this.state;
    return (
      <WebView source={{ uri: repositoryUrl }} style={{ marginTop: 20 }} />
    );
  }
}
