import React, { Component } from 'react';
import { ActionTypes } from '../constants/actionTypes';
import { connect } from 'react-redux';

class Questions extends Component {

    onAnswer = (question, option) => {
        let quiz = JSON.parse(JSON.stringify(this.props.quiz));
        let q = quiz.questions.find(x => x.id === question.id);
        if (q.questionTypeId === 1) {
            q.options.forEach((x) => { x.selected = false; });
        }
        q.options.find(x => x.id === option.id).selected = true;
        this.props.onAnswer(quiz);
    }

    render() {
        const { quiz, pager, move } = this.props;
        let questions = (quiz.questions) ? quiz.questions.slice(pager.index, pager.index + pager.size) : [];
        return (
            <div id="quiz">
                <h2 className="text-center font-weight-normal">{quiz.name}</h2>
                {questions.map(ques =>
                    <div key={ques.id}>
                        <div className="badge badge-info">Question {pager.index + 1} of {pager.count}.</div>
                        <h3 className="font-weight-normal">{pager.index + 1}. <span>{ques.name}</span></h3>
                        <div className="row text-left options">
                            {
                                ques.options.map(option =>
                                    <div key={option.id} className="col-6">
                                        <div className="option">
                                            <label className="font-weight-normal" htmlFor={option.id}>
                                                <input id={option.id} checked={option.selected} type="radio" onChange={() => this.onAnswer(ques, option)} />
                                                {option.name}
                                            </label>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                )}
                <div className="text-center">
                    {quiz.config.allowBack && <button id="prev" className="btn btn-primary" onClick={move}>Prev</button>}
                    <button id="next" className="btn btn-primary" onClick={move}>Next</button>
                </div>
            </div >
        )
    }
}

const mapStateToProps = state => ({ ...state.quiz, ...state.mode, ...state.pager });

const mapDispatchToProps = dispatch => ({
    onAnswer: payload => dispatch({ type: ActionTypes.QuizAnswer, payload })
});

export default connect(mapStateToProps, mapDispatchToProps)(Questions);
