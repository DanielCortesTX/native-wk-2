import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, Button, StyleSheet } from 'react-native';
import { Card, Icon, Input, Rating } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        comments: state.comments,
        favorites: state.favorites
    };
};

const mapDispatchToProps = {
    postFavorite: campsiteId => (postFavorite(campsiteId)),
    postComment: (campsiteId, rating, author, text) => (postComment(campsiteId, rating, author, text))
};


function RenderCampsite(props) {

    const { campsite } = props;

    if (campsite) {
        return (
            <Card
                featuredTitle={campsite.name}
                image={{ uri: baseUrl + campsite.image }}
            >
                <Text style={{ margin: 10 }}>
                    {campsite.description}
                </Text>
                <View style={styles.cardRow}>
                    <Icon
                        name={props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        raised
                        reverse
                        onPress={() => props.favorite ?
                            console.log('Already set as a favorite')
                            : props.markFavorite()}
                    />
                    <Icon
                        name='pencil'
                        type='font-awesome'
                        color='#5637dd'
                        raised
                        reverse
                        onPress={() => props.onShowModal()}
                    />
                </View>

            </Card>
        );
    }
    return <View />;
}

function RenderComments({ comments }) {

    const renderCommentItem = ({ item }) => {
        return (
            <View style={{ margin: 10 }}> 
               
                <Text style={{ fontSize: 14 }}>{item.text}</Text>
                <Rating imageSize={10} readonly startingValue={item.rating} 
                style={{alignItems:'flex-start', paddingVertical: 10}}>Stars</Rating>
                <Text style={{ fontSize: 12 }}>{`--${item.author}, ${item.date} `}</Text>

            </View>
        );
    };


    return (
        <Card title='Comments'>
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    )

}

class CampsiteInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rating: 5,
            author: '',
            text: '',
            showModal: false
        };
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });/*passing this to modify state*/
    }
    resetForm() {
        this.setState({
            rating: 5,
            author: '',
            text: '',
            showModal: false
        });
    }
    markFavorite(campsiteId) {
        this.props.postFavorite(campsiteId);
    }

    
    handleComment(campsiteId) { 
        this.props.postComment(
            campsiteId,
            this.state.rating,
            this.state.author,
            this.state.text
        );
        this.toggleModal();
    }

    static navigationOptions = {
        title: 'Campsite Information'
    }

    render() {
        const campsiteId = this.props.navigation.getParam('campsiteId');
        const campsite = this.props.campsites.campsites.filter(campsite => campsite.id === campsiteId)[0];
        const comments = this.props.comments.comments.filter(comment => comment.campsiteId === campsiteId);
        return (
            <ScrollView>
                <RenderCampsite campsite={campsite}
                    favorite={this.props.favorites.includes(campsiteId)}
                    markFavorite={() => this.markFavorite(campsiteId)}
                    onShowModal={() => this.toggleModal()}
                />
                <RenderComments comments={comments} />
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleModal()}
                >
                    <View style={styles.modal}>
                        <Rating
                            showRating
                            startingValue={this.state.rating}
                            imageSize={40}
                            onFinishRating={rating => this.setState({ rating: rating })}
                            style={{ paddingVertical: 10 }}
                        />
                        <Input placeholder='Author'
                            leftIcon={
                                <Icon
                                    name='user-o'
                                    size={20}
                                    color='black'
                                    type='font-awesome'
                                />
                            }
                            leftContainerStyle={{ paddingRight: 10 }}
                            onChangeText={author => this.setState({ author: author })}
                            value={this.state.author}
                        />
                        <Input placeholder='Comment'
                            leftIcon={
                                <Icon
                                    name='comment-o'
                                    size={20}
                                    color='black'
                                    type='font-awesome'
                                />
                            }
                            leftContainerStyle={{ paddingRight: 10 }}
                            onChangeText={text => this.setState({ text: text })}
                            value={this.state.text}
                        />
                        <View style={{ margin: 10 }}>
                            <Button
                                onPress={() => {
                                    this.handleComment(campsiteId);
                                    this.resetForm();
                                }}
                                color='#5637DD'
                                title='Submit'
                            />
                        </View>
                        <View style={{ margin: 10 }}>
                            <Button
                                onPress={() => {
                                    this.toggleModal();
                                    this.resetForm()
                                }}
                                color='#808080'
                                title='Cancel'
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    cardRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },

});

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);
