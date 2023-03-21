import React from 'react';
import Slider from './Slider';
import Icon from '../Icon';

function TextFormat() {
  return (
    <div className="w-full h-full rounded-xl bg-white overflow-hidden relative">
      <div className="absolute w-full h-full z-10 bg-gray-500/80" />
      <div className="grid w-full h-full grid-cols-8">
        <div className="relative h-10 w-10">
          <Icon icon={<p className="absolute font-rockwell text-white left-4 top-3 text-3xl">T</p>} />
        </div>
        <div className="col-span-7 pt-2 pl-2 sm:pl-3 lg:pl-6 xl:pl-0">
          <div className="pl-2 sm:p-0 font-bold">
            Tekst Formaat
          </div>
          <div className="pr-4 py-4 flex-1 h-full w-full flex flex-col gap-y-2">
            {/* Font size slider */}

            <div className="flex items-center justify-between">
              <div className="flex gap-y-2 w-2/3 md:w-1/2 lg:w-1/3 flex-col">
                <Slider name="fontSizeSlider" id="fontSizeSlider" min="1" max="150" styling="slider cursor-pointer" />
                <div className="flex justify-between">
                  <div className="text-xs">1</div>
                  <div className="text-xs">150</div>
                </div>
              </div>
              <div className="flex justify-center rounded-[50%] bg-accent-500 w-8 h-8 text-white">
                <span className="self-center text-xs">
                  {/* Change based on slider value */}
                  48
                </span>
              </div>
            </div>
            {/* Sample Text */}
            <div className="overflow-y-auto flex-1 h-full max-h-[13rem]">
              {/* Change text-[] based on slider value */}
              <p className="text-black text-xs leading-4 italic">
                Mr. and Mrs. Dursley, of number four, Privet Drive, were
                proud to say that they were perfectly normal, thank
                you very much. They were the last people you&apos;d expect to be in-
                volved in anything strange or mysterious, because they just didn&apos;t
                hold with such nonsense.
                Mr. Dursley was the director of a firm called Grunnings, which
                made drills. He was a big, beefy man with hardly any neck, al-
                though he did have a very large mustache. Mrs. Dursley was thin
                and blonde and had nearly twice the usual amount of neck, which
                came in very useful as she spent so much of her time craning over
                garden fences, spying on the neighbors. The Dursleys had a small
                son called Dudley and in their opinion there was no finer boy
                anywhere.
                The Dursleys had everything they wanted, but they also had a
                secret, and their greatest fear was that somebody would discover it.
                the boy who lived
                2
                They didn&apos;t think they could bear it if anyone found out about the
                Potters. Mrs. Potter was Mrs. Dursley&apos;s sister, but they hadn&apos;t met
                for several years; in fact, Mrs. Dursley pretended she didn&apos;t have a
                sister, because her sister and her good-for-nothing husband were
                as unDursleyish as it was possible to be. The Dursleys shuddered
                to think what the neighbors would say if the Potters arrived in the
                street. The Dursleys knew that the Potters had a small son, too, but
                they had never even seen him. This boy was another good reason
                for keeping the Potters away; they didn&apos;t want Dudley mixing with
                a child like that.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextFormat;
