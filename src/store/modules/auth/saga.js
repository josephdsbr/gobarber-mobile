import {takeLatest, call, put, all} from 'redux-saga/effects';
import { Alert } from 'react-native';
import api from '~/services/api';

import {signInSuccess, signFailure} from './actions';
export function* signIn({payload}) {
  try {
    const {email, password} = payload;

    const response = yield call(api.post, 'sessions', {
      email,
      password,
    });

    const {token, user} = response.data;

    if (user.provider) {
      Alert.alert('Erro no login', 'User can not be a provider');
      return;
    }

    api.defaults.headers.Authorization = `Bearer ${token}`;

    yield put(signInSuccess(token, user));

  } catch (err) {
    Alert.alert('Fail in authentication','Please, check your infomations.');
    yield put(signFailure());
  }
}

export function* signUp({payload}) {
  try {
    const {name, email, password} = payload;
    
    yield call(api.post, 'users', {
      name,
      email,
      password,
    });

    Alert.alert('User registered', 'Thanks, for registering!');
  } catch (err) {
    Alert.alert('Fail in registration', 'Please, check you informations!');
    yield put(signFailure());
  }
}

export function setToken({payload}) {
  if (!payload) return;

  const {token} = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export function signOut() {
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
  takeLatest('@auth/SIGN_OUT', signOut),
]);
