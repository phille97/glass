import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { usePocket } from "../contexts/PocketContext";

export const Index = () => {
  const { loginWithProvider, user } = usePocket();
  const navigate = useNavigate();

  useEffect(() => {
	if (user) {
		navigate('/admin');
	}
  }, [user]);

  return (
    <section>
      <h1>Welcome to INSANEO.se</h1>
      <h2>Sign in with</h2>
      <button type="submit" onClick={() => loginWithProvider('github')}>GitHub</button>
      <span> or </span>
      <button type="submit" onClick={() => loginWithProvider('discord')}>Discord</button>
    </section>
  );
};