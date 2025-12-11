const Dashboard = () => {
  const user = localStorage.getItem("token");

  return (
    <div>
      <h1>Bem-vindo ao Academic Share</h1>
      <p>Estás autenticado!</p>

      <button onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      }}>
        Terminar Sessão
      </button>
    </div>
  );
};

export default Dashboard;
