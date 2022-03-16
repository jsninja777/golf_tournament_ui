import React from "react";
import loadable from '@loadable/component';
import { Route, Routes } from "react-router-dom";

const Tournament = loadable(() => import('../containers/Tournaments'));
const TournamentShow = loadable(() => import('../containers/Tournaments/Show'));
const Player = loadable(() => import('../containers/Players'));

export const Container = ({ match }) => {
  return (
    <Routes>
      <Route path="/" element={<Tournament />} />
      <Route exact path="tournament/:id" element={<TournamentShow />} />
      <Route exact path="players" element={<Player />} />
    </Routes>
  );
};

export default Container;
