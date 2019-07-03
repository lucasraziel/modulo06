import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import api from '../../services/api';

import {
  Container,
  Header,
  Name,
  Avatar,
  Bio,
  Starred,
  Stars,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: true,
    page: 0,
    loadingEnd: false,
  };

  componentDidMount() {
    this.update();
  }

  componentDidUpdate(_, _prevState) {
    const { stars } = this.state;
    if (_prevState.stars !== stars) {
      this.update();
    }
  }

  handleEndReached = async () => {
    this.setState({ loadingEnd: true });
  };

  async update() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { page } = this.state;

    const response = await api.get(
      `/users/${user.login}/starred?page=${page + 1}`
    );

    this.setState({
      stars: response.data,
      loading: false,
      page: page + 1,
      loadingEnd: false,
    });
  }

  render() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { stars, loading, loadingEnd } = this.state;
    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <ActivityIndicator color="#7159c1" />
        ) : (
          <Stars
            data={stars}
            onEndReached={this.handleEndReached}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
        {loadingEnd && <ActivityIndicator color="#7159c1" />}
      </Container>
    );
  }
}
