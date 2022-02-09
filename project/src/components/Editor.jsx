import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, {
  defaultSuggestionsFilter
} from '@draft-js-plugins/mention';
import editorStyles from './SimpleMentionEditor.module.css';
import '@draft-js-plugins/mention/lib/plugin.css';


let mentions  = [
  // {
  //   name: 'Matthew Russell',
  //   link: 'https://twitter.com/mrussell247',
  //   avatar:
  //     'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg',
  // },
  // {
  //   name: 'Julian Krispel-Samsel',
  //   link: 'https://twitter.com/juliandoesstuff',
  //   avatar: 'https://avatars2.githubusercontent.com/u/1188186?v=3&s=400',
  // },
  // {
  //   name: 'Jyoti Puri',
  //   link: 'https://twitter.com/jyopur',
  //   avatar: 'https://avatars0.githubusercontent.com/u/2182307?v=3&s=400',
  // },
  // {
  //   name: 'Max Stoiber',
  //   link: 'https://twitter.com/mxstbr',
  //   avatar: 'https://avatars0.githubusercontent.com/u/7525670?s=200&v=4',
  // },
  // {
  //   name: 'Nik Graf',
  //   link: 'https://twitter.com/nikgraf',
  //   avatar: 'https://avatars0.githubusercontent.com/u/223045?v=3&s=400',
  // },
  // {
  //   name: 'Pascal Brandt',
  //   link: 'https://twitter.com/psbrandt',
  //   avatar:
  //     'https://pbs.twimg.com/profile_images/688487813025640448/E6O6I011_400x400.png',
  // },
]

export default function TextInput(props) {
  //let mentions = [];
  useEffect(() => {
    if(props.mentions.length > 0)
  {
    let mentionData = props.mentions;
    mentionData.forEach((profile) => {
      mentions.push({name : profile.name, avatar : profile.image, link : profile.uid});
    })
  }
  console.log(props.mentions);
  console.log(mentions);
  }, [])
  
  const ref = useRef(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(mentions);
  const [content, setContent] = useState("");

  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      entityMutability: 'IMMUTABLE',
      mentionPrefix: '@',
      supportWhitespace: true,
    });
    // eslint-disable-next-line no-shadow
    const { MentionSuggestions } = mentionPlugin;
    // eslint-disable-next-line no-shadow
    const plugins = [mentionPlugin];
    return { plugins, MentionSuggestions };
  }, []);

  const onOpenChange = useCallback((_open) => {
    setOpen(_open);
  }, []);
  const onSearchChange = useCallback(({ value }) => {
    setSuggestions(defaultSuggestionsFilter(value, mentions));
  }, []);

  const getInput = () => {
    const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
    const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
    return value;
  }

  let bodyValue = getInput();

  if(content !== bodyValue)
  {
    setContent(bodyValue);
    props.setContent(bodyValue);
  }

  return (
    <div
      className={editorStyles.editor}
      onClick={() => {
        ref.current.focus();
      }}
    >
      <Editor
        editorKey={'editor'}
        editorState={editorState}
        onChange={setEditorState}
        plugins={plugins}
        ref={ref}
      />
      <MentionSuggestions
        open={open}
        onOpenChange={onOpenChange}
        suggestions={suggestions}
        onSearchChange={onSearchChange}
        onAddMention = {(mentioned) => {
          props.addMentionedUsers(mentioned);
        }}
      />
    </div>
  );
}