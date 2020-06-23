import React, { Component } from 'react';
import { ActionTypes } from '../constants/actionTypes';
import Review from './Review';
// import Modal from './Modal';
import Questions from './Questions';
import Result from './Result';
import { connect } from 'react-redux';
import './modal.css';

const LENGTH = 2;

const Modal = ({ handleClose, show, children }) => {
    const showHideClassName = show ? 'modal display-block' : 'modal display-none';

    return (
      <div className={showHideClassName}>
        <section className='modal-main'>
          {children}
          <button className="model-btn" onClick={handleClose}>Close</button>
        </section>
      </div>
    );
  };


class Quiz extends Component {
    constructor(props) {
        super(props);
        this.state = { show: false };
    }

    showModal = () => {
        this.setState({ show: true });
    };

    hideModal = () => {
        this.setState({ show: false });
    };

    move = e => {
        let id = e.target.id;
        let index = 0;
        if (id === 'first')
            index = 0;
        else if (id === 'prev')
            index = this.props.pager.index - 1;
        else if (id === 'next')
            index = this.props.pager.index + 1;
        else
            index = parseInt(e.target.id, LENGTH);

        if (index >= 0 && index < this.props.pager.count) {
            let pager = {
                index: index,
                size: 1,
                count: this.props.pager.count
            };
            this.props.onPagerUpdate(pager);
        }
    }

    setMode = e => this.props.onSubmit(e.target.id);

    renderMode() {
        const { mode, quiz } = this.props;
        if (mode === 'quiz') {
            return (<Questions move={this.move} />)
        } else if (mode === 'review') {
            return (<Review quiz={quiz} move={this.move} />)
        } else {
            return (<Result questions={quiz.questions || []} />)
        }
    }
    render() {
        const { quiz, pager } = this.props;
        return (
            <div>
                {this.renderMode()}
                {(this.props.mode !== 'submit') &&
                    <div>
                        <button id="submit" className="btn btn-primary" onClick={this.setMode}>Submit Quiz</button>
                        <button type="button" className="btn btn-primary" onClick={this.showModal}>Show Answer</button>
                        <Modal show={this.state.show} handleClose={this.hideModal}>
                            <div className="ques">Question: {quiz && quiz.questions && quiz.questions[this.props.pager.index] && quiz.questions[pager.index].name}</div>
                            <div className="modal-body">Answer: {quiz && quiz.questions && quiz.questions[pager.index] && quiz.questions[pager.index].options.map(function(ans) { if(ans.isAnswer === true) { return ans.name }})}</div>
                        </Modal>
                    </div >}
            </div>
        )
    }
}

const mapStateToProps = state => { return { ...state.quiz, ...state.mode, ...state.pager } };

const mapDispatchToProps = dispatch => ({
    onSubmit: payload => dispatch({ type: ActionTypes.QuizSubmit, payload }),
    onPagerUpdate: payload => dispatch({ type: ActionTypes.PagerUpdate, payload })
});


export default connect(mapStateToProps, mapDispatchToProps)(Quiz);
