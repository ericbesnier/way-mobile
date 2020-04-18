import A_red from '../assets/locationRed/A_red.png';
import B_red from '../assets/locationRed/B_red.png';
import C_red from '../assets/locationRed/C_red.png';
import D_red from '../assets/locationRed/D_red.png';
import E_red from '../assets/locationRed/E_red.png';
import F_red from '../assets/locationRed/F_red.png';
import G_red from '../assets/locationRed/G_red.png';
import H_red from '../assets/locationRed/H_red.png';
import I_red from '../assets/locationRed/I_red.png';
import J_red from '../assets/locationRed/J_red.png';
import K_red from '../assets/locationRed/K_red.png';
import L_red from '../assets/locationRed/L_red.png';
import M_red from '../assets/locationRed/M_red.png';
import N_red from '../assets/locationRed/N_red.png';
import O_red from '../assets/locationRed/O_red.png';
import P_red from '../assets/locationRed/P_red.png';
import Q_red from '../assets/locationRed/Q_red.png';
import R_red from '../assets/locationRed/R_red.png';
import S_red from '../assets/locationRed/S_red.png';
import T_red from '../assets/locationRed/T_red.png';
import U_red from '../assets/locationRed/U_red.png';
import V_red from '../assets/locationRed/V_red.png';
import W_red from '../assets/locationRed/W_red.png';
import X_red from '../assets/locationRed/X_red.png';
import Y_red from '../assets/locationRed/Y_red.png';
import Z_red from '../assets/locationRed/Z_red.png';

import A_blue from '../assets/locationBlue/A_blue.png';
import B_blue from '../assets/locationBlue/B_blue.png';
import C_blue from '../assets/locationBlue/C_blue.png';
import D_blue from '../assets/locationBlue/D_blue.png';
import E_blue from '../assets/locationBlue/E_blue.png';
import F_blue from '../assets/locationBlue/F_blue.png';
import G_blue from '../assets/locationBlue/G_blue.png';
import H_blue from '../assets/locationBlue/H_blue.png';
import I_blue from '../assets/locationBlue/I_blue.png';
import J_blue from '../assets/locationBlue/J_blue.png';
import K_blue from '../assets/locationBlue/K_blue.png';
import L_blue from '../assets/locationBlue/L_blue.png';
import M_blue from '../assets/locationBlue/M_blue.png';
import N_blue from '../assets/locationBlue/N_blue.png';
import O_blue from '../assets/locationBlue/O_blue.png';
import P_blue from '../assets/locationBlue/P_blue.png';
import Q_blue from '../assets/locationBlue/Q_blue.png';
import R_blue from '../assets/locationBlue/R_blue.png';
import S_blue from '../assets/locationBlue/S_blue.png';
import T_blue from '../assets/locationBlue/T_blue.png';
import U_blue from '../assets/locationBlue/U_blue.png';
import V_blue from '../assets/locationBlue/V_blue.png';
import W_blue from '../assets/locationBlue/W_blue.png';
import X_blue from '../assets/locationBlue/X_blue.png';
import Y_blue from '../assets/locationBlue/Y_blue.png';
import Z_blue from '../assets/locationBlue/Z_blue.png';

import A_orange from '../assets/locationOrange/A_orange.png';
import B_orange from '../assets/locationOrange/B_orange.png';
import C_orange from '../assets/locationOrange/C_orange.png';
import D_orange from '../assets/locationOrange/D_orange.png';
import E_orange from '../assets/locationOrange/E_orange.png';
import F_orange from '../assets/locationOrange/F_orange.png';
import G_orange from '../assets/locationOrange/G_orange.png';
import H_orange from '../assets/locationOrange/H_orange.png';
import I_orange from '../assets/locationOrange/I_orange.png';
import J_orange from '../assets/locationOrange/J_orange.png';
import K_orange from '../assets/locationOrange/K_orange.png';
import L_orange from '../assets/locationOrange/L_orange.png';
import M_orange from '../assets/locationOrange/M_orange.png';
import N_orange from '../assets/locationOrange/N_orange.png';
import O_orange from '../assets/locationOrange/O_orange.png';
import P_orange from '../assets/locationOrange/P_orange.png';
import Q_orange from '../assets/locationOrange/Q_orange.png';
import R_orange from '../assets/locationOrange/R_orange.png';
import S_orange from '../assets/locationOrange/S_orange.png';
import T_orange from '../assets/locationOrange/T_orange.png';
import U_orange from '../assets/locationOrange/U_orange.png';
import V_orange from '../assets/locationOrange/V_orange.png';
import W_orange from '../assets/locationOrange/W_orange.png';
import X_orange from '../assets/locationOrange/X_orange.png';
import Y_orange from '../assets/locationOrange/Y_orange.png';
import Z_orange from '../assets/locationOrange/Z_orange.png';

const imagesRed = {
  A_red, B_red, C_red, D_red, E_red, F_red, G_red, H_red,
  I_red, J_red, K_red, L_red, M_red, N_red, O_red, P_red, Q_red, R_red, S_red,
  T_red, U_red, V_red, W_red, X_red, Y_red, Z_red
};

const imagesBlue = {
  A_blue, B_blue, C_blue, D_blue, E_blue, F_blue, G_blue, H_blue,
  I_blue, J_blue, K_blue, L_blue, M_blue, N_blue, O_blue, P_blue, Q_blue, R_blue, S_blue,
  T_blue, U_blue, V_blue, W_blue, X_blue, Y_blue, Z_blue
};

const imagesOrange = {
  A_orange, B_orange, C_orange, D_orange, E_orange, F_orange, G_orange, H_orange,
  I_orange, J_orange, K_orange, L_orange, M_orange, N_orange, O_orange, P_orange, Q_orange, R_orange, S_orange,
  T_orange, U_orange, V_orange, W_orange, X_orange, Y_orange, Z_orange
};

export const getImage = (initiale, color) => {

  console.log('getImage: initiale=', initiale, ' color=', color);
  var image;
  switch (color) {
    case 'red':
      image = imagesRed[initiale + '_red'];
      break;
    case 'blue':
      image = imagesBlue[initiale + '_blue'];
      break;
      case 'orange':
      image = imagesOrange[initiale + '_orange'];
      break;
    default:
      console.log('getImage: this color doesn\'t exist !');
  }
  console.log('getImage: image=', image);
  return image;
}
