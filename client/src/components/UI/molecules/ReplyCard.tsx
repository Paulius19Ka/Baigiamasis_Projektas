import { Reply } from "../../../types";

type Props = { reply: Reply };
const ReplyCard = ({ reply }: Props) => {
  return (
    <div>
      <p>{reply.reply}</p>
      <p>User: {reply.username}</p>
      <p>Replied: {reply.replyDate.slice(0, 10)}, {reply.replyDate.slice(11, 16)}</p>
      {
        reply.lastEditDate && <p>Edited: {reply.lastEditDate.slice(0, 10)}, {reply.lastEditDate.slice(11, 16)}</p>
      }
    </div>
  );
}
 
export default ReplyCard;