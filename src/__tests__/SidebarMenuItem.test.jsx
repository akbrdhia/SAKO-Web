import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import SidebarMenuItem from '../components/SidebarMenuItem.jsx';

describe('SidebarMenuItem', () => {
  it('renders label, img and link when src and to provided', () => {
    render(
      <MemoryRouter>
        <SidebarMenuItem src="/assets/icon/dashboard.svg" label="Dashboard" to="/dashboard" />
      </MemoryRouter>
    );

    // label
    expect(screen.getByText('Dashboard')).toBeInTheDocument();

    // image
    const img = screen.getByAltText(/Dashboard icon/i);
    expect(img).toHaveAttribute('src', '/assets/icon/dashboard.svg');

    // link
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/dashboard');
  });
});
