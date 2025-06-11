import { Component } from '@angular/core';
import { CategoryCode } from '../models/Category';
import { CATEGORIES } from '../data/Categories';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-categories.component',
  imports: [RouterLink, NgClass],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  categories = CATEGORIES;

  colorsMap: Record<number, string> = {
    [CategoryCode.Drawing]: 'bg-red-500/70 border-red-500 hover:bg-red-700/80',
    [CategoryCode.Painting]:
      'bg-pink-500/70 border-pink-500 hover:bg-pink-700/80',
    [CategoryCode.Surfaces]:
      'bg-yellow-500/70 border-yellow-500 hover:bg-yellow-700/80',
    [CategoryCode.Brushes]:
      'bg-green-500/70 border-green-500 hover:bg-green-700/80',
    [CategoryCode.Easels]:
      'bg-blue-500/70 border-blue-500 hover:bg-blue-700/80',
    [CategoryCode.Printmaking]:
      'bg-purple-500/70 border-purple-500 hover:bg-purple-700/80',
    [CategoryCode.Sculpting]:
      'bg-amber-500/70 border-amber-500 hover:bg-amber-700/80',
    [CategoryCode.KidsArt]:
      'bg-pink-400/70 border-pink-400 hover:bg-pink-600/80',
    [CategoryCode.StudioSupplies]:
      'bg-gray-400/70 border-gray-400 hover:bg-gray-600/80',
    [CategoryCode.Framing]:
      'bg-rose-400/70 border-rose-400 hover:bg-rose-600/80',
    [CategoryCode.DigitalArt]:
      'bg-indigo-500/70 border-indigo-500 hover:bg-indigo-700/80',
    [CategoryCode.Calligraphy]:
      'bg-teal-500/70 border-teal-500 hover:bg-teal-700/80',
    [CategoryCode.ArtSets]:
      'bg-orange-500/70 border-orange-500 hover:bg-orange-700/80',
    [CategoryCode.ArtBooks]:
      'bg-lime-500/70 border-lime-500 hover:bg-lime-700/80',
    [CategoryCode.ArtTools]:
      'bg-cyan-500/70 border-cyan-500 hover:bg-cyan-700/80',
    [CategoryCode.ArtAccessories]:
      'bg-fuchsia-500/70 border-fuchsia-500 hover:bg-fuchsia-700/80',
    [CategoryCode.ArtStorage]:
      'bg-stone-500/70 border-stone-500 hover:bg-stone-700/80',
    [CategoryCode.Miscellaneous]:
      'bg-neutral-500/70 border-neutral-500 hover:bg-neutral-700/80',
  };

  getColorClasses(categoryId: CategoryCode): string {
    return `${
      this.colorsMap[categoryId] ??
      'bg-gray-400/70 border-gray-400 hover:bg-gray-600/80'
    } border-2`;
  }
}
