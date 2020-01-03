import React from 'react';
import './index.css'
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import Box from '@material-ui/core/Box';
import {
    GridContextProvider,
    GridDropZone,
    GridItem,
    swap
  } from "react-grid-dnd";
import { Grid } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';

class TodoApp extends React.Component {
    constructor(props) {
      super(props);
      this.state = { items: [], text: '', count: 0 };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    render() {
      var space = '  '
      return (
        <Grid container alignItems="center" direction="column" justify="center">
          <h1 align="center">Today's To Do list</h1>
          <TodoList items={this.state.items} />
            <div id="add">
            <form onSubmit={this.handleSubmit}>
                <TextField id="outlined-basic" label="What needs to be done?" variant="outlined"
                    inputProps={{maxLength:100}}
                    onChange={this.handleChange}
                    value={this.state.text}
                    style={{verticalAlign: "middle"}}
                >
                </TextField>
                {space}
                <Button style={{verticalAlign: "middle"}} type="submit" variant="contained" color="primary">
                Add #{this.state.count}
                </Button>
            </form>
            </div>
          </Grid>
      );
    }
  
    handleChange(e) {
      this.setState({ text: e.target.value });
    }
  
    handleSubmit(e) {
      e.preventDefault();
      if (!this.state.text.length) {
        return;
      }
      let newItem = <TodoItem handleDelete={this.delete.bind(this)} text={this.state.text} id={this.state.count}/>
      this.setState(state => ({
        items: state.items.concat(newItem),
        count: state.count + 1,
        text: ''
      }));
    }

    delete(index){
        const newItems = this.state.items.filter(item => item.props.id !== index)
        this.setState({items: newItems})
    }
  }
  
  class TodoItem extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            text: this.props.text,
            id: this.props.id,
            complete: false,
        }
        this.deleteButton = this.deleteButton.bind(this);
    }
    render() {
        return (
                <ListItem height="50%"align="left" divider="true">
                    <Checkbox style={{verticalAlign: "middle"}} onClick={() => this.setState({complete: !this.state.complete})}></Checkbox>
                    <Box className={this.state.complete ? "crossed-line" : ""} component="span" display ="block">#{this.props.id} {this.state.text} </Box>
                    <DeleteIcon style={{verticalAlign: "middle"}} onClick = {() => this.deleteButton(this.props.id)}></DeleteIcon>
                    <EditIcon style={{verticalAlign: "middle"}} onClick = {() => this.modifyButton()}></EditIcon>
                    <DragHandleIcon style={{verticalAlign: "middle"}}></DragHandleIcon>
                </ListItem>
        )
    }



    deleteButton(id){
        this.props.handleDelete(id);
    }

    modifyButton(){
        const newText = prompt("Please update your item", this.state.text);
        if(newText != null){
            this.setState(() => ({text: newText}));
        }

    }
  }
  
  class TodoList extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            filtered: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this.setState({
          filtered: this.props.items
        });
      }
      
      componentWillReceiveProps(nextProps) {
        this.setState({
          filtered: nextProps.items
        });
      }
    
    handleChange(e) {
        let current = [];
        let newList = [];
        if(e.target.value !== ""){
            current = this.props.items;
            newList = current.filter(item => {
                const lc = item.props.text.toLowerCase();
                const tlc = e.target.value.toLowerCase();
                return lc.includes(tlc);
            });
        } else{
            newList = this.props.items;
        }
        this.setState({filtered: newList});
    }
    

    onChange(sourceId, sourceIndex, targetIndex, targetId) {
        const nextItems = swap(this.state.filtered, sourceIndex, targetIndex);
        this.setState({filtered: nextItems})
    }

    render() {
        return (
            <Box>
            <TextField variant = "outlined"label="Search..." onChange={this.handleChange}></TextField>
            <List>
            <GridContextProvider onChange={this.onChange}>
              <GridDropZone
                id="items"
                boxesPerRow={1}
                rowHeight={50}
                style={{ height: "400px" }}
              >
                {this.state.filtered.map(item => (
                  <GridItem key={item.props.id}>
                    <div
                      style={{
                        width: "300%",
                        height: "100%"
                      }}
                    >
                      {item}
                    </div>
                  </GridItem>
                ))}
              </GridDropZone>
            </GridContextProvider>
            </List>
            </Box>

          );
    }
  }
  
  ReactDOM.render(
    <TodoApp />,
    document.getElementById('root')
  );