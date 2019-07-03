import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Keyboard } from 'react-native';
import { Container, SubmitButton, Form, Input } from './styles';
import api from '../../services/api';

export default class Main extends Component {
  state = {
    users: [],
    newUser: '',
  };

  handleAddUser = async () => {
    const { newUser, users } = this.state;

    const response = await api.get(`/users/${newUser}`);

    const user = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };

    this.setState({ users: [...users, user], newUser: '' });

    Keyboard.dismiss();
  };

  render() {
    const { users, newUser } = this.state;
    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar Usuário"
            value={newUser}
            onChangeText={text => this.setState({ newUser: text })}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
          />
          <SubmitButton onPress={this.handleAddUser}>
            <Icon name="add" size={20} color="#FFF" />
          </SubmitButton>
        </Form>
      </Container>
    );
  }
}

Main.navigationOptions = {
  title: 'Usuários',
};
