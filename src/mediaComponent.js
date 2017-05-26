import React from 'react';

const MediaComponent = (props) => {
  const entity = props.contentState.getEntity(
    props.block.getEntityAt(0)
  );
  const {src} = entity.getData();
  const type = entity.getType();
  let media;
  if (type === 'audio') {
    media = <Audio src={src} />;
  } else if (type === 'image' || type === 'math') {
    media = <Image src={src} />;
  } else if (type === 'video') {
    media = <Video src={src} />;
  } 
  return media;
};

const Audio = (props) => {
  return <audio controls src={props.src} style={styles.media} />;
};
const Image = (props) => {
  return <img alt='formula or image' src={props.src} style={styles.media} />;
};
const Video = (props) => {
  return <video controls src={props.src} style={styles.media} />;
};

const styles = {
  media: {
    width: '50%',
  },
};

export default MediaComponent;