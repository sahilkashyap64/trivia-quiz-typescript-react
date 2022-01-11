
import axios, { CancelTokenSource } from 'axios';
const getQuestion=()=> {
    return axios.get('https://jservice.io/api/random')
      .then(response => response)
  }


const QuestionService = {
  getQuestion
};


export default QuestionService;