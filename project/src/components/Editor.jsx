import React from "react";
import { EditorState, convertToRaw } from "draft-js";
import Editor from "@draft-js-plugins/editor";
import createMentionPlugin, {
  defaultSuggestionsFilter
} from "@draft-js-plugins/mention";
import editorStyles from "./editorStyles.module.css";
import '@draft-js-plugins/mention/lib/plugin.css';

const mentions =  [
    {
      name: "Matthew Russell",
      link: "https://twitter.com/mrussell247",
      avatar:
        "https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg",
      userId: 13
    },
    {
      name: "Julian Krispel-Samsel",
      link: "https://twitter.com/juliandoesstuff",
      avatar: "https://avatars2.githubusercontent.com/u/1188186?v=3&s=400"
    },
    {
      name: "Jyoti Puri",
      link: "https://twitter.com/jyopur",
      avatar: "https://avatars0.githubusercontent.com/u/2182307?v=3&s=400"
    },
    {
      name: "Max Stoiber",
      link: "https://twitter.com/mxstbr",
      avatar:
        "https://pbs.twimg.com/profile_images/763033229993574400/6frGyDyA_400x400.jpg"
    },
    {
      name: "Nik Graf",
      link: "https://twitter.com/nikgraf",
      avatar: "https://avatars0.githubusercontent.com/u/223045?v=3&s=400"
    },
    {
      name: "Pascal Brandt",
      link: "https://twitter.com/psbrandt",
      avatar:
        "https://pbs.twimg.com/profile_images/688487813025640448/E6O6I011_400x400.png"
    }
  ];

class TextInput extends React.Component {
  constructor(props) {
    super(props);

    this.mentionPlugin = createMentionPlugin();
  }


  state = {
    editorState: EditorState.createEmpty(),
    suggestions: mentions,
    dismiss : true,
  };

  onChange = editorState => {
    this.setState({ editorState });
  };

  onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentions)
    });
  };

  onExtractData = () => {
    const contentState = this.state.editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    console.log(raw);
  };

  onExtractMentions = () => {
    const contentState = this.state.editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    let mentionedUsers = [];
    for (let key in raw.entityMap) {
      const ent = raw.entityMap[key];
      if (ent.type === "mention") {
        mentionedUsers.push(ent.data.mention);
      }
    }
    console.log(mentionedUsers);
  };

  render() {
    const { MentionSuggestions } = this.mentionPlugin;
    const plugins = [this.mentionPlugin];

    return (
      <div>
        <div className={editorStyles.editor}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
          />
          <MentionSuggestions
            onSearchChange={this.onSearchChange}
            suggestions={this.state.suggestions}
            onOpenChange = {() => {}}
            open = {this.state.dismiss}
            onAddMention = {() => {this.setState({dismiss : false});}}
          />
        </div>
      </div>
    );
  }
}

export default TextInput;
