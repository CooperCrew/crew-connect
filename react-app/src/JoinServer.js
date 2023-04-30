import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";


function JoinServer({ id }) {
  const { inviteCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("JoinServer: inviteCode:", inviteCode, "userID:", id);
    async function joinServer() {
      try {
        const response = await fetch(`/join/${inviteCode}/user/${id}`, {
          method: "POST",
        });
        if (response.ok) {
          navigate('/');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    joinServer();
  }, [inviteCode, id, navigate]);  

  return <div>Joining server...</div>;
}

export default JoinServer;
