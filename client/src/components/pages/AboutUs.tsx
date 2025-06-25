import { useEffect } from "react";
import styled from "styled-components";

const StyledSection = styled.section`
  padding: 0px 10px;

  > img{
    width: 80%;
    max-width: 400px;
    height: auto;
    display: block;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 10px;
  }

  > p, li{
    margin: 0;
    padding: 0;
  }

  > p{
    padding: 10px 0px;
  }

  > ul{
    margin: 0;
    list-style-type: circle;
    padding-left: 20px;
  }

  @media (min-width: 768px){
    padding: 0px 30px;

    p, li{
      font-size: 1.05rem;
    }

    img{
      max-width: 500px;
    }
  }

  @media (min-width: 1024px){
    padding: 0px 50px;
    /* max-width: 70%; */
    
    p, li{
      font-size: 1.1rem;
    }

    img{
      max-width: 550px;
    }
  }
`;

const AboutUs = () => {

  useEffect(() => {
    document.title = `About \u2666 MusicForum`;
  }, []);

  return (
    <StyledSection>
      <h2>About the Forum</h2>
      <img src="/public/media/forumLogo.png" alt="a vinyl record with message symbol on the side" />
      <p>
        Welcome to the ultimate haven for music lovers, collectors, and curious ears alike.
      </p>
      <p>
        Our discussion forum is built for anyone who finds joy in rhythm, melody, and meaningful conversation. Whether you're a lifelong vinyl hunter, a concert regular, or just someone exploring genres, you're in the right place.
      </p>
      <p>
        Here, you'll find spaces to talk about:
      </p>
      <ul>
        <li>🎵 General musings and everyday music banter</li>
        <li>📣 Releases - be the first to know and share what's hot</li>
        <li>💿 Collecting tips, trades, and prized finds</li>
        <li>🎤 Concerts - relive the magic or discover where to go next</li>
        <li>🎸 Rock-Blues to soothe the soul and stir nostalgia</li>
        <li>🕺 Pop-Dance for catchy hooks and body-moving beats</li>
        <li>🤘 Metal-Hard Rock to crank it up and let loose</li>
        <li>🎷 Jazz, the heartbeat of improvisation</li>
        <li>🎻 Classical, timeless and transcendent</li>
        <li>🎧 Electronic, where sound meets innovation</li>
        <li>🤠 Country-Folk, storytelling through strings</li>
        <li>🖤 Soul-Rap, rhythm, poetry, and raw feeling</li>
        <li>🌀 Alternative, for everything unexpected</li>
        <li>🧩 And of course, Misc - where everything else finds a voice</li>
      </ul>
      <p>
        We're here to celebrate diversity in taste, promote respectful debate, and discover the music that moves us. Dive into the forums, share your thoughts, and connect with fellow enthusiasts across genres and generations.
      </p>
      <p>
        Let's make some noise.
      </p>
    </StyledSection>
  );
}
 
export default AboutUs;