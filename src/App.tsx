import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios, { CancelTokenSource } from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup'; 
import QuestionDataService from "./services/list";
type UserSubmitForm = {
  useranswer: string;
};

interface IQuestion {
  id: number;
  value?: number;
  answer: string;
  question: string;
}
const defaultPosts: IQuestion[] = [];
const App: React.FC = () => {
  const [questions, setQuestions]: [IQuestion[], (questions: IQuestion[]) => void] = React.useState(
    defaultPosts
  );

  const [loading, setLoading]: [
    boolean,
    (loading: boolean) => void
  ] = React.useState<boolean>(true);

  const [error, setError]: [string, (error: string) => void] = React.useState(
    ''
  );

  const cancelToken = axios.CancelToken; //create cancel token
  const [cancelTokenSource, setCancelTokenSource]: [
    CancelTokenSource,
    (cancelTokenSource: CancelTokenSource) => void
  ] = React.useState(cancelToken.source());

  const handleCancelClick = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel('User cancelled operation');
    }
  };
  const validationSchema = Yup.object().shape({
    
    useranswer: Yup.string()
      .required('Answer is required')
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UserSubmitForm>({
    resolver: yupResolver(validationSchema)
  });
  const onSubmit = (data: UserSubmitForm) => {
    // console.log(JSON.stringify(data, null, 2));
   const ans= data.useranswer.localeCompare(questions[0]['answer'], undefined, { sensitivity: 'accent' });
  //  console.log("ans",ans);
   if(ans==0){
      // console.log("Correct Answer");
      alert('Correct Answer');
      retrieveRandomQuestion();
    }else{
      // console.log("InCorrect Answer");
      alert('InCorrect Answer');
      retrieveRandomQuestion();
    }
    reset();
  };

  const retrieveRandomQuestion = () => {
    
    QuestionDataService.getQuestion().then((response) => {
        setQuestions(response.data);
        setLoading(false);
      })
      .catch((ex) => {
        let error = axios.isCancel(ex)
          ? 'Request Cancelled'
          : ex.code === 'ECONNABORTED'
          ? 'A timeout has occurred'
          : ex.response.status === 404
          ? 'Resource Not Found'
          : 'An unexpected error has occurred';

        setError(error);
        setLoading(false);
      });
  }
  React.useEffect(() => {
    retrieveRandomQuestion();
  }, []);
  return (
    <div className="container-fluid">
       {loading && <button onClick={handleCancelClick}>Cancel</button>}
       <h3>Random trivia</h3>
      <ul className="posts">
        
        {questions.map((post) => (
          
          <div className="card">
          <div className="card-header">Question </div>
          <div className="card-body">
          {post.question }
          
          </div>

          <div className="card-footer"><p>Answer</p>{post.answer} </div>
       </div>
          
        ))}
      </ul>
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="form-group">
          <label>Enter your answer</label>
          <input
            type="text"
            {...register('useranswer')}
            className={`form-control ${errors.useranswer ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.useranswer?.message}</div>
        </div>


        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="btn btn-warning float-right"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};
export default App;
