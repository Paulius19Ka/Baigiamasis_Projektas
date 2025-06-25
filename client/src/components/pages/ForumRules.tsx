import { useEffect } from "react";
import styled from "styled-components";

const StyledSection = styled.section`
  padding: 0px 10px;
  > ol{
    list-style-type: upper-roman;
    padding-left: 20px;

    > li{
      margin: 10px 0px;
      > h3{
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
      }

      > p{
        margin: 0;
        font-size: 1rem;
      }
    }
  }

  @media (min-width: 768px){
    padding: 0px 30px;

    > ol{

      > li{

        > p{
          font-size: 1.05rem;
        }

        > h3{
          font-size: 1.1rem;
        }
      }
    }
  }

  @media (min-width: 1024px){
    padding: 0px 50px;

    > ol{

      > li{

        > p{
          font-size: 1.1rem;
        }
        
        > h3{
          font-size: 1.15rem;
        }
      }
    }
  }
`;

const ForumRules = () => {

  useEffect(() => {
    document.title = `Forum Rules \u2666 MusicForum`;
  }, []);

  return (
    <StyledSection>
      <h2>Forum Rules</h2>
      <ol>
        <li>
          <h3>Be Respectful</h3>
          <p>
            Treat all members with kindness and consideration. Personal attacks, hate speech, harassment, or discrimination of any kind will not be tolerated.
          </p>
        </li>
        <li>
          <h3>Stay On Topic</h3>
          <p>
            Keep discussions relevant to the forum's purpose. Off-topic posts may be moved or removed to keep conversations focused.
          </p>
        </li>
        <li>
          <h3>Use Clear and Appropriate Language</h3>
          <p>
            Avoid excessive slang, profanity, or typing in all caps. Communicate clearly to promote understanding.
          </p>
        </li>
        <li>
          <h3>No Spam or Self-Promotion</h3>
          <p>
            Refrain from posting unsolicited advertisements or repetitive messages. Promoting your own content is allowed only in designated areas (if any).
          </p>
        </li>
        <li>
          <h3>Respect Privacy</h3>
          <p>
            Do not share personal information about yourself or others. This includes contact details, private messages, or identifying information.
          </p>
        </li>
        <li>
          <h3>Report Issues</h3>
          <p>
            If you see a violation of these rules or a concerning post, report it to the moderators instead of engaging directly.
          </p>
        </li>
        <li>
          <h3>Follow Moderator Guidance</h3>
          <p>
            Moderators are here to help keep the forum healthy. Please respect their decisions and instructions.
          </p>
        </li>
      </ol>
    </StyledSection>
  );
}
 
export default ForumRules;