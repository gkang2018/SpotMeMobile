import React, {Component} from 'react'
import {View, Text, StyleSheet} from 'react-native'


class TransactionCard extends Component {
    constructor(props) {
        super(props)
    }

    render(){
        const {sender, recipient, amount, message, createdAt} = this.props; 
        return (
            <View style = {styles.container}>
                <Text>{sender.name} paid {recipient.name} $ {amount}  on {createdAt}</Text>
                <Text>{message}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1.75,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "black",
        marginBottom: 15
    }
})


export default TransactionCard