import React, {Component} from 'react';
import Navigation from './app/Navigation';
import {ThemeContextProvider} from './app/components/theme/ThemeContextProvider';
import Icon from 'react-native-vector-icons/Feather';

class App extends Component {
  render() {
    return (
      <ThemeContextProvider>
        <Navigation />
      </ThemeContextProvider>
    );
  }
}
Icon.loadFont();

export default App;
