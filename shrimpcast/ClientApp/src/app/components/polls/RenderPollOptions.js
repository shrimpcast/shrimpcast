import React, { useEffect, useState } from "react";
import PollOption from "./PollOption";
import SignalRManager from "../../managers/SignalRManager";

const RenderPollOptions = (props) => {
  const [options, setOptions] = useState([]),
    { signalR } = props,
    calculatePercentages = (pollOptions, searchOnExisting, votes) => {
      let voteOptions = pollOptions.filter((option) => option.isActive);

      if (searchOnExisting) {
        voteOptions.forEach((option) => {
          option.voteCount = votes.find((v) => v.pollOptionId === option.pollOptionId)?.count || 0;
        });
      }

      let totalVotes = voteOptions.reduce((a, b) => a + b.voteCount, 0);
      voteOptions.forEach((voteOption) => {
        voteOption.percentage = totalVotes ? (voteOption.voteCount * 100) / totalVotes : 0;
      });

      return voteOptions;
    },
    addNewOptionHandler = () => {
      signalR.on(SignalRManager.events.pollOptionAdded, (newOption) =>
        setOptions((existingOptions) => {
          let newOptions = existingOptions;
          newOptions = newOptions.concat(newOption);
          return newOptions;
        })
      );
      signalR.on(SignalRManager.events.pollOptionRemoved, (pollOptionId) =>
        setOptions((existingOptions) => {
          let newOptions = existingOptions;
          if (!pollOptionId) {
            newOptions.forEach((option) => {
              option.isActive = false;
            });
          } else {
            newOptions.find((option) => option.pollOptionId === pollOptionId).isActive = false;
          }

          if (pollOptionId === props.selectedOption || !pollOptionId) {
            props.setSelectedOption(0);
          }

          newOptions = newOptions.concat({ isActive: false });
          return newOptions;
        })
      );
    },
    addVoteUpdateHandler = () =>
      signalR.on(SignalRManager.events.pollVoteUpdate, (votes) =>
        setOptions((existingOptions) => calculatePercentages(existingOptions, true, votes))
      );

  useEffect(() => {
    addNewOptionHandler();
    addVoteUpdateHandler();
    return () => {
      signalR.off(SignalRManager.events.pollOptionAdded);
      signalR.off(SignalRManager.events.pollOptionRemoved);
      signalR.off(SignalRManager.events.pollVoteUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedOption]);

  useEffect(() => {
    setOptions(calculatePercentages(props.poll.options));
  }, [props.poll.options]);

  return (
    <>
      {options.map((option) =>
        option.isActive ? (
          <PollOption
            key={option.pollOptionId}
            signalR={props.signalR}
            isAdmin={props.isAdmin}
            isMod={props.isMod}
            userSessionId={props.sessionId}
            selectedOption={props.selectedOption}
            setSelectedOption={props.setSelectedOption}
            configuration={props.configuration}
            {...option}
          />
        ) : null
      )}
    </>
  );
};

export default RenderPollOptions;
