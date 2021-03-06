import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';


const todoPage = (() => {
  const visibilityFilter = (
    state = 'SHOW_ALL',
    action
  ) => {
    switch (action.type) {
      case 'SET_VISIBILITY_FILTER':
        return action.filter;
      default:
        return state;
    }
  }

  const todo = (state, action) => {
    switch (action.type) {
      case 'ADD_TODO':
        return {
            id: action.id,
            text: action.text,
            completed: false,
          }
      case 'TOGGLE_TODO':
        if (action.id !== state.id) {
          return state;
        }

        return {
          ...state,
          completed: !state.completed,
        }
      default:
        return state;
    }
  }

  const todos = (state = [], action) => {
    switch (action.type) {
      case 'ADD_TODO':
        return [
          ...state,
          todo(undefined, action)
        ]
      case 'TOGGLE_TODO':
        return state.map(t => todo(t, action))
      default:
        return state;
    }
  }

  const todoApp = combineReducers({
    todos,
    visibilityFilter
  })

  const Link = ({
    active,
    children,
    onClick,
  }) => {
    if (active) {
      return <span>{children}</span>
    }
    return (
      <a
        href='#'
        onClick={e => {
          e.preventDefault();
          onClick();
        }}
      >
        {children}
      </a>
    )
  }

  const mapStateToLinkProps = (
    state,
    ownProps
  ) => {
    return {
      active:
        ownProps.filter ===
        state.visibilityFilter
    }
  }

  const mapDispatchToLinkProps = (
    dispatch,
    ownProps
  ) => {
    return {
      onClick: () => {
        dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter: ownProps.filter,
        })
      }
    }
  }

  const FilterLink = connect(
    mapStateToLinkProps,
    mapDispatchToLinkProps
  )(Link);

  const getVisibleTodos = (
    todos,
    filter,
  ) => {
    switch (filter) {
      case 'SHOW_ALL':
        return todos;
      case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed)
      case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed)
    }
  }

  const Todo = ({
    onClick,
    completed,
    text,
    key,
  }) => (
    <li
      key={key}
      onClick={onClick}
      style={{
        textDecoration:
          completed ?
          'line-through' :
          'none'
      }}
    >
      {text}
    </li>
  )

  const TodoList = ({
    todos,
    onTodoClick
  }) => (
    <ul>
      {todos.map(todo =>
        <Todo
          key={todo.id}
          {...todo}
          onClick={() => onTodoClick(todo.id)}
        />
        )}
    </ul>
  )

  let AddTodo = (dispatch) => {
    let input;

    return (
      <div>
        <input ref={node => {input = node;}}>
        </input>
        <button
        onClick={() => {
          dispatch({
            type: 'ADD_TODO',
            id: nextTodo += 1,
            text: input.value,
          })
          input.value = '';
        }}
        >
          Add Todo
        </button>
      </div>
    )
  }
  AddTodo = connect()(AddTodo);

  const Footer = () => (
    <p>
      Show:
      {' '}
      <FilterLink
        filter= 'SHOW_ALL'
      >
        ALL
      </FilterLink>
      {' '}
      <FilterLink
        filter= 'SHOW_ACTIVE'
      >
        Active
      </FilterLink>
      {' '}
      <FilterLink
        filter= 'SHOW_COMPLETED'
      >
        Completed
      </FilterLink>
    </p>
  )

  const mapStateToTodoListProps = (state) => {
    return {
      todos: getVisibleTodos(
        state.todos,
        state.visibilityFilter
      )
    }
  }
  const mapDispatchToTodoListProps = (dispatch) => {
    return {
      onTodoClick: (id) => {
        dispatch({
          type: 'TOGGLE_TODO',
          id,
        })
      }
    }
  }
  const VisibleTodoList = connect(
    mapStateToTodoListProps,
    mapDispatchToTodoListProps
  )(TodoList);

  let nextTodo = 0;
  const TodoApp = () => (
    <div>
      <AddTodo />
      <VisibleTodoList />
      <Footer />
    </div>
  )

  const store = createStore(todoApp)
  console.log('STORE: ', store)
  ReactDOM.render(
    <Provider store={store} >
      <TodoApp />
    </Provider>,
    document.getElementById('root')
  )
})()

export default todoPage;
