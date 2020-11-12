import React, { Component } from 'react';
import {ForceGraph, ForceGraphNode, ForceGraphLink} from 'react-vis-force';
import PropTypes from 'prop-types';

class Hud extends Component {
    state = {};
    constructor(props){
        super(props);

        this.state = {
            data: {
                "nodes": [],
                "links": []
              },
        };

    }

    render() {
        return (
            <div ref={el => (this.container = el)}>
                <ForceGraph 
                    zoom
                    simulationOptions={{ width: this.state.width, height: this.state.height, animate: true, alpha: 1 }}>
                {this.state.data.nodes.map(node => (
                    <ForceGraphNode
                        key={node.id}
                        node={{ ...node}}
                        fill={getFill(node)}
                    />
                    ))}
                {this.state.data.links.map(link => (
                    <ForceGraphLink
                        key={`${link.source}=>${link.target}`}
                        link={{ ...link, value: 1 }}
                    />
                    ))
                }
                </ForceGraph>
            </div>
        );
    }

    updateMap = () => {
        if(this.props.currentRoom){
            let data = this.state.data;

            // Ensure we have the current room and its exits on the map.
            data = addCurrentRoom(data, this.props.currentRoom);

            // Update what I can see
            data = updateVisible(data, this.props.currentRoom);

            this.setState({
                data: data,
            });
        }
    }

    resize = () => {
        this.setState({ width: this.container.clientWidth, height: this.container.clientHeight });
    };

    componentDidMount() {
        this.resize();
        window.addEventListener('resize', this.resize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    componentDidUpdate(previousProps) {
        if(previousProps.currentRoom?.RoomNumber != this.props.currentRoom?.RoomNumber){
            this.updateMap();
        }
    }
}

// Add the current room and its exits to the map
const addCurrentRoom = (caveData, currentRoom) => {
    if(!caveData.nodes.some(r => r.id == currentRoom.RoomNumber)){
        caveData.nodes.push({
            'id': currentRoom.RoomNumber.toString(),
        });
    }

    // Ensure all of the exits exist, too.
    currentRoom.Exits.forEach(exit => {
        if(!caveData.nodes.some(r => r.id == exit.RoomNumber)){
            caveData.nodes.push({
                'id': exit.RoomNumber.toString(),
            });
        }
    });

    // And then add links between this room and its exits.
    currentRoom.Exits.forEach(exit => {
        if(!caveData.links.some(link => isLinked(currentRoom, exit, link))) {
            caveData.links.push({
                'source': currentRoom.RoomNumber,
                'target': exit.RoomNumber,
            })
        }
    });

    return caveData;
}


const isLinked = (room1, room2, link) => {
    return link.source == room1.RoomNumber && link.target == room2.RoomNumber
    || link.source == room2.RoomNumber && link.target == room1.RoomNumber;
}

// Update what I can see
const updateVisible = (caveData, currentRoom) => {
    caveData.nodes.forEach(roomNode => {
        const seenRoom = (currentRoom.RoomNumber == roomNode.id)? currentRoom: 
            currentRoom.Exits.find(r => r.RoomNumber == roomNode.id);

        // Update isCurrent on all rooms, even if not seen (super bat snatch)
        roomNode.isCurrent = currentRoom.RoomNumber == roomNode.id;
        if(seenRoom){
            roomNode.hasHazard = seenRoom.Hazards.length > 0;
        }
    });

    return caveData;
}

const getFill = (roomNode) => {
    if(roomNode.isCurrent){
        return 'darkblue';
    }
    if(roomNode.hasHazard){
        return 'darkred';
    }
    return 'darkgreen';
}

Hud.propTypes = {
    currentRoom: PropTypes.shape({
        Exits: PropTypes.array,
        RoomNumber: PropTypes.number,
    }),
}

export default Hud;