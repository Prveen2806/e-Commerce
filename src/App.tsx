import {RouterProvider } from "react-router-dom";
import routes from "./routes";

// const App = () => (
//   <BrowserRouter>
//     <AuthProvider>
//       <CartProvider>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/" element={<AppLayout><Home /></AppLayout>} />
//           <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
//           <Route path="/checkout" element={<AppLayout><Checkout /></AppLayout>} />
//           <Route path="/admin" element={<AppLayout><Admin /></AppLayout>} />
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </CartProvider>
//     </AuthProvider>
//   </BrowserRouter>
// );

function App(){
  return <RouterProvider router={routes} />
}

export default App;
