import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import {SQLiteDatabase} from 'react-native-sqlite-storage';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {getDBConnection, searchWord} from './src/lib/db-service';

const App = () => {
  const [textInputValue, setTextInputValue] = useState('');
  const [dbState, setDbState] = useState<SQLiteDatabase>();
  const [results, setResults] = useState<Dictionary.WordItem[]>([]);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const loadDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection();
      setDbState(db);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadDataCallback();
  }, []);

  const handleTextChange = useCallback(
    async (text: string) => {
      setTextInputValue(text);
      try {
        if (dbState) {
          const a = await searchWord(dbState, text);
          console.log(a);
          setResults(a);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [dbState],
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <TextInput
        onChangeText={handleTextChange}
        value={textInputValue}
        placeholder="Search Word"
        style={styles.textInput}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={styles.searchResultItemCont}>
          {results.map(item => (
            <View style={styles.searchResultItem}>
              <View style={styles.searchResultItemTypeCont}>
                <Text style={styles.searchResultItemType}>Type: </Text>
                <Text>{item.wordtype}</Text>
              </View>
              <View style={styles.searchResultItemDefinitionCont}>
                <Text style={styles.searchResultItemDefinition}>
                  {item.definition.replace(/\\n/g, '')}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    backgroundColor: 'white',
  },
  searchResultItemCont: {
    marginTop: 10,
    marginBottom: 60,
  },
  searchResultItem: {
    paddingLeft: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    flexDirection: 'column',
    marginBottom: 5,
  },
  searchResultItemTypeCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchResultItemType: {
    fontWeight: '600',
    fontSize: 16,
  },
  searchResultItemDefinitionCont: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  searchResultItemDefinition: {
    fontWeight: '600',
    fontSize: 14,
  },
});

export default App;
