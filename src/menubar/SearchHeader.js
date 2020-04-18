import React, { Component } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import { SearchBar } from 'react-native-elements';
import Constants from 'expo-constants';

import { 
  setSearch, 
  cancelSearch 
} from '../contacts/ContactsActions';

class SearchHeader extends Component {
  state = {
    search: '',
  };

  onClear = () => {
    console.log('SearchHeader/onClear');
  }

  onCancel = (goBack) => {
    console.log('SearchHeader/onCancel');
    goBack(null);
    this.props.cancelSearch();
  }

  handleInputChange = (search) => {
    this.props.setSearch(search);
    this.setState({ search });
  }

  render() {
    // console.log('SearchHeader/render');
    const {
      contacts
    } = this.props;
    const { goBack } = this.props.navigation;
    const os = Platform.OS === 'ios' ? 'ios' : 'android';
    const { search } = this.state;
    return (
      <View style={styles.header}>
        <SearchBar
          searchIcon={{ size: 24 }}
          platform={os}
          showLoading={contacts.showLoading}
          autoFocus={true}
          clearIcon={true}
          lightTheme={true}
          onChangeText={search => this.handleInputChange(search)}
          value={search}
          onClear={this.onClear}
          onCancel={() => this.onCancel(goBack)}
          placeholder='Rechercher des contacts...'
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#e1e8ee',
  },
});

const mapStateToProps = (state) => {
  return {
    contacts: state.contacts,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setSearch: (search) => dispatch(setSearch(search)),
  cancelSearch: () => dispatch(cancelSearch()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchHeader);