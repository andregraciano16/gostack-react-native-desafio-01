import React, { useState, useEffect } from 'react';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import api from './services/api';

export default function App() {

  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    })
  }, []);

  async function handleLikeRepository(id) {
    api.post(`repositories/${id}/like`).then(response => {
      const index = repositories.findIndex(repository => repository.id === id)
      if (index >= 0) {
        repositories.splice(index, 1);
        setRepositories([...repositories, response.data])
      }

    })
  }

  function mensagemCurtida(likes){
    return likes > 1 ? `${likes} curtidas` : `${likes} curtida`
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.repositoryContainer}
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({ item: repository }) => (
            <>
              <Text style={styles.repository}>{repository.title}</Text>
              <FlatList
                style={styles.techsContainer}
                data={repository.techs}
                keyExtractor={tech => tech}
                renderItem={({ item: tech }) => (
                  <View style={styles.techsContainer}>
                    <Text style={styles.tech}>{tech}</Text>
                  </View>
                )} />
              <View style={styles.likesContainer}>
                <Text style={styles.likeText} testID={`repository-likes-${repository.id}`}>
                   {mensagemCurtida(repository.likes)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </>
          )} />

      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#7159c1",
    margin: 20,
    height: 50,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
});
