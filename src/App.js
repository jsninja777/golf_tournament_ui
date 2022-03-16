import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout, Menu, Image } from 'antd';
import Containers from "./containers";

const { Header } = Layout;


function App() {
  return (
    <Layout className="layout">
      <Header>
        <a href={'/'}><Image
          width={50}
          height={50}
          preview={{ visible: false }}
          src="https://www.pngfind.com/pngs/m/669-6692892_logo-sample-logo-designs-for-schools-hd-png.png"
        /></a>
        
        <Menu theme="dark" mode="horizontal" style={{float: 'right'}}>
           <Menu.Item key={1}><a href={'/'}>{`Tournament`}</a></Menu.Item>
           <Menu.Item key={2}><a href={'/players'}>{`Players`}</a></Menu.Item>
        </Menu>
      </Header>
      <BrowserRouter>
        <Routes>
         <Route path="*" element={<Containers />} />
        </Routes>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
