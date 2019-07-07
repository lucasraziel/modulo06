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
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: true,
    page: 1,
    refreshing: false,
    refreshingEnd: false,
  };

  componentDidMount() {
    this.update();
  }

  handleEndReached = async () => {
    const { page } = this.state;
    await this.setState({ refreshingEnd: true, page: page + 1 });

    this.update();
  };

  refreshList = async () => {
    await this.setState({ page: 1, refreshing: true });
    this.update();
  };

  update = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { stars, page, refreshing } = this.state;

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);
    let newStars = [];
    if (refreshing) {
      newStars = response.data;
    } else {
      newStars = [...stars, ...response.data];
    }

    this.setState({
      stars: newStars,
      loading: false,
      refreshing: false,
      refreshingEnd: false,
    });
  };

  handleNavigate = starred => {
    const { navigation } = this.props;
    navigation.navigate('Starred', { starred });
  };

  render() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { stars, loading, refreshing, refreshingEnd } = this.state;
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
            keyExtractor={star => String(star.id)}
            refreshing={refreshing}
            onRefresh={this.refreshList}
            onEndReachedThreshold={0.2}
            onEndReached={this.handleEndReached}
            ListFooterComponent={() =>
              refreshingEnd ? <ActivityIndicator color="#7159c1" /> : null
            }
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
