import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoginScreen from './LoginScreen';
import { signout as _signout } from '../redux/Store';
import { deleteSendingRelationsById as _deleteSendingRelationsById } from '../sendingRelation/SendingRelationActions';
import AppStateLayer from '../appState/AppStateLayer';
import { AppRootNavigator } from '../routes/AppTabNavigator';

class AppLogin extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    areSendingRelationsDeleted: false
  }

  componentDidUpdate = () => {
    const {
      user,
      deleteSendingRelationsById
    } = this.props;
    // console.log('AppLogin/componentDidUpdate: !this.state.areSendingRelationsDeleted=', !this.state.areSendingRelationsDeleted);

    if (!this.state.areSendingRelationsDeleted && user.userInfos._id != null) {
      // console.log('AppLogin/componentDidUpdate: user=', user);
      deleteSendingRelationsById(user.userInfos._id);
      this.setState({ areSendingRelationsDeleted: true });
    }
  }

  render() {
    const {
      user
    } = this.props;
    // console.log('AppLogin/render: user=', user);

    if (user.userInfos.isLogged) {
      return (
        <AppStateLayer>
          <AppRootNavigator />
        </AppStateLayer>
      );
    }
    return <LoginScreen />;
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => ({
  signout: () => _signout(),
  deleteSendingRelationsById: (_id) => dispatch(_deleteSendingRelationsById(_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppLogin);
