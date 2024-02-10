import * as React from 'react'
import { View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';

const HomeScreen = () => {
    return (
        <View>
            <Text style={styles.textCaption}>HomeScreen</Text>
            <Icon name="rocket" size={30} color="#900" />
        </View>
    )
}

export default HomeScreen