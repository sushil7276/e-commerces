import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [gender, setGender] = useState<string>("");
  const [date, setDate] = useState<string>("");

  return (
    <div className='login'>
      <main>
        <h1 className="heading">Login</h1>
        <div>
          <label htmlFor='gender'>Gender</label>
          <select
            name='gender'
            value={gender}
            required
            onChange={(e) => setGender(e.target.value)}
          >
            <option value=''>Select Gender</option>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </select>
        </div>
        <div>
          <label htmlFor='date'>Date of birth</label>
          <input
            type='date'
            name='date'
            value={date}
            required
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <p>Already Signed In Once</p>
          <button>
            <FcGoogle /> <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
}
