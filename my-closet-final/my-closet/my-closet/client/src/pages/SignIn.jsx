import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import logo from '../../assets/logo2.png'; // Adjust the path to the new logo

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/Cloth');
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className='min-h-screen flex flex-col justify-center items-center p-3'>
      <img src={logo} alt="Logo" className="w-32 h-auto my-4" />
      <h1 className='text-3xl text-center font-semibold mb-4'>Bem vindo de volta!</h1>
      <form onSubmit={handleSubmit} className='w-full max-w-sm flex flex-col gap-4'>
        <input
          type='email'
          placeholder='Email'
          id='email'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Senha'
          id='password'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign-in'}
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Não tem uma conta?</p>
        <Link to='/sign-up'>
          <span className='text-blue-500'>Registre-se</span>
        </Link>
      </div>
      <p className='text-red-700 mt-5'>
        {error ? error.message || 'Something went wrong!' : ''}
      </p>
    </div>
  );
}
