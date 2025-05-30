import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function HomeScreen() {
  return (
    <div className="max-w-3xl min-h-[100vh] mx-auto flex items-center justify-center">
      <Card className="m-10 w-full bg-grey-50 shadow-lg">
        <CardHeader className="text-center min-h-full flex flex-col items-center justify-center ">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Welcome to the SpotTheDifference
          </CardTitle>
          <ul className="flex flex-col items-center justify-center space-y-4 mt-6">
            <li>
              <Link to="/play">
                <Button variant="myButton" size="lg">
                  Start
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/about">
                <Button variant="myButton" size="lg">
                  How To Play?
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/admin">
                <Button variant="myButton" size="lg">
                  ADMIN Settings
                </Button>
              </Link>
            </li>
            <li>
              <Button variant="myButton" size="lg">
                Exit
              </Button>
            </li>
          </ul>
        </CardHeader>
      </Card>
    </div>
  );
}
